import { InjectionKey, Ref, inject, ref } from 'vue';
import signals from 'signals';
export type FocusToCallback = (key: string) => void;

export interface PhoenixContext {
  kongyaji: Ref<Array<Record<string, any>>>;
  zhusuji: Ref<Array<Record<string, any>>>;
  chongyaji: Ref<Array<Record<string, any>>>;
  bofenghan: Ref<Array<Record<string, any>>>;
  events: {
    focusTo: signals.Signal<any>;
    warn: signals.Signal<any>;
  };
  // onFocusTo: (callback: FocusToCallback) => void;
}
export const injectContextKey = Symbol('$phoenixContext') as InjectionKey<PhoenixContext>;

export const useContext = () => {
  return inject(injectContextKey, {
    kongyaji: ref([]),
    zhusuji: ref([]),
    chongyaji: ref([]),
    bofenghan: ref(),
    events: {
      focusTo: new signals.Signal(),
      warn: new signals.Signal(),
    },
    // onFocusTo: () => {},
  });
};
