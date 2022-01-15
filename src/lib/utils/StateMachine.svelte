<script lang="ts" context="module">
  type StateEventMapping<S> = {
    [State in keyof S as State]: string
  }

  interface StateMachineConfig<S extends StateEventMapping<S>> {
    id: string
    initial: keyof S
    states: MachineStates<S>
    debug?: boolean
  }

  type MachineStates<S extends StateEventMapping<S>> = {
    [State in keyof S as State]: {
      [event in S[State]]: MachineEvent<S>
    } & {
      entry?: (data?: unknown) => void | Promise<void>
      exit?: (data?: unknown) => void | Promise<void>
    }
  }

  interface MachineEvent<S> {
    action?: (data?: unknown) => void | Promise<void>
    guard?: () => boolean
    target: keyof S
  }

  export class StateMachine<S extends StateEventMapping<S>, E extends string> {
    private readonly config: StateMachineConfig<S>
    public current: keyof S

    constructor(config: StateMachineConfig<S>) {
      this.config = config
      this.current = config.initial
    }

    private setState(newState: keyof S): void {
      if (this.config.debug) {
        console.info(`[${this.config.id}] Changed state from: "${this.current}" to: "${newState}"`)
      }

      this.current = newState
    }

    private getStateConfig(state: keyof S) {
      return this.config.states[state as unknown as keyof MachineStates<S>] //as unknown as MachineStates<S>
    }

    private async stateEntryAction(data?: unknown): Promise<void> {
      const currentStateConfig = this.getStateConfig(this.current)

      if (currentStateConfig.entry) {
        currentStateConfig.entry(data)
      }
    }

    public async send(event: E, data?: unknown): Promise<void> {
      const machineState = this.getStateConfig(this.current)
      // @ts-ignore
      const machineEvent = machineState[event] as MachineEvent<S>

      if (!machineEvent) {
        throw new Error(`[${this.config.id}] Unable to find event "${event}" under state "${this.current}"`)
      }

      if (machineEvent.action) {
        machineEvent.action(data)
      }

      if (machineEvent.guard ? machineEvent.guard() : true) {
        if (this.config.debug) {
          console.info(`[${this.config.id}] Triggered event "${event}" under state "${this.current}"`)
        }

        this.setState(machineEvent.target)
        this.stateEntryAction(data)
      }
    }
  }
</script>
