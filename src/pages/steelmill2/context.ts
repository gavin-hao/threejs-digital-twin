import { InjectionKey, Ref, inject } from 'vue';
import signals from 'signals';
export type FocusToCallback = (key: string) => void;

export interface SteelmillContext {
  // kongyaji: Ref<Array<Record<string, any>>>;
  // zhusuji: Ref<Array<Record<string, any>>>;
  // chongyaji: Ref<Array<Record<string, any>>>;
  status?: Ref<Array<Record<string, any>>>;
  events: {
    focusTo: signals.Signal<any>;
    warn: signals.Signal<any>;
  };
  // onFocusTo: (callback: FocusToCallback) => void;
}
export const injectContextKey = Symbol('$steelmillContext') as InjectionKey<SteelmillContext>;

export const useContext = () => {
  return inject(injectContextKey, {
    events: {
      focusTo: new signals.Signal(),
      warn: new signals.Signal(),
    },
    // onFocusTo: () => {},
  });
};
