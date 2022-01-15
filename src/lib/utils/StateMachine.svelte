<script lang="ts" context="module">
  type StateEventMapping<S> = {
    [State in keyof S as State]: string
  }

  interface StateMachineConfig<S extends StateEventMapping<S>, EventData> {
    id: string
    initial: keyof S
    states: MachineStates<S, EventData>
    debug?: boolean
  }

  type MachineStates<S extends StateEventMapping<S>, EventData> = {
    [State in keyof S as State]: {
      [event in S[State]]: MachineEvent<S, EventData>
    } & {
      entry?:<T> (data?: T) => void | Promise<void>
      exit?:<T> (data?: T) => void | Promise<void>
    }
  }

  interface MachineEvent<S, EventData> {
    action?:<T> (data?: T) => void | Promise<void>
    guard?: () => boolean
    target: keyof S
  }

  export class StateMachine<S extends StateEventMapping<S>, E extends string, EventData extends { [key: string]: any }> {
    private readonly config: StateMachineConfig<S, EventData>
    public current: keyof S

    constructor(config: StateMachineConfig<S, EventData>) {
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
      return this.config.states[state as unknown as keyof MachineStates<S, EventData>]
    }

    private async stateEntryAction(data?: EventData[E]): Promise<void> {
      const currentStateConfig = this.getStateConfig(this.current)

      if (currentStateConfig.entry) {
        currentStateConfig.entry(data)
      }
    }

    public async send(event: E, data?: EventData[E]): Promise<void> {
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
