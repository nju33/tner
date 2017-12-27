// @flow
import instantify from 'instantify';

const delay = (ms: number = 15): Promise<void> => {
  return new Promise(r => setTimeout(r, ms));
}

export default class Tner {
  el: HTMLELement;
  _from: object;
  _to: object;

  constructor(el: HTMLElement) {
    this.el = el;

    this.el.addEventListener('transitionend', this._handleTransitionend);
  }

  _handleTransitionend = () => {
    Object.assign(this.el.style, {
      webkitBackfaceVisibility: '',
      backfaceVisibility: '',
      willChange: '',
    });
  }

  get _optimization() {
    return {
      webkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      willChange: this._getWillChangeProps().join(', '),
    };
  }

  _getWillChangeProps(): string[] {
    return Object.keys(this._to);
  }

  from(from: object): this {
    this._from = from;
    return this;
  }

  to(to: object): this {
    this._to = to;
    return this;
  }

  _delay(ms: number = 0): Promise<void> {
    return delay(ms);
  }

  get reverse() {
    const tner = new Tner(this.el);
    return tner.from(this._to).to(this._from);
  }

  async process(): Promise<void> {
    if (typeof this._from === 'undefined') {
      throw new TypeError('Set the `from`');
    }

    if (typeof this._to === 'undefined') {
      throw new TypeError('Set the `to`');
    }

    const pRestore = await instantify(this.el);
    Object.assign(this.el.style, this._optimisation, this._from);
    await pRestore();

    Object.assign(this.el.style, this._optimisation, this._to);
    await this._delay();
  }

  teardown() {
    this.el.removeEventListener('transitionend', this._handleTransitionend);
  }
}
