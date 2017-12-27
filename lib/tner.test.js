// @flow
import {JSDOM} from 'jsdom';
import Tner from './tner';

describe('Tner', () => {
  let window;
  let tner;

  beforeAll(() => {
    global.getComputedStyle = jest.fn().mockReturnValue({transition: '.2s'});
    window = new JSDOM(`<!DOCTYPE html><div id="foo"></div>`).window;
  });

  beforeEach(() => {
    tner = new Tner(window.document.getElementById('foo'));
  });

  test('process throw when not set `from`', async () => {
    await expect(tner.process()).rejects.toThrowError('Set the `from`');
  });

  test('process throw when not set `to`', async () => {
    tner.from({});
    await expect(tner.process()).rejects.toThrowError('Set the `to`');
  });

  test('process', async () => {
    tner._delay = jest.fn();
    tner.from({}).to({color: 'pink'});
    await tner.process()
    expect(tner._delay).toHaveBeenCalled();
  });

  test('willChangeProps', () => {
    tner.to({
      opacity: 1,
      color: 'red',
    });
    expect(tner._getWillChangeProps()).toEqual(['opacity', 'color']);
  });

  test('optimization', () => {
    tner.to({
      opacity: 1,
      color: 'red',
    });
    expect(tner._optimization).toEqual({
      webkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden',
      willChange: 'opacity, color',
    });
  })

  test('reverse', () => {
    const reversedTner = tner.from({opacity: 0}).to({opacity: 1}).reverse;
    expect(reversedTner._from).toEqual({opacity: 1});
    expect(reversedTner._to).toEqual({opacity: 0});
  });
});
