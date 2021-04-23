import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import 'regenerator-runtime/runtime';

import { createPortal, expectPortal } from '../../../utils/portal';
import { Grommet } from '../../Grommet';
import { DateInput } from '..';

const DATE = '2020-07-02T00:00:00-08:00';
const DATES = ['2020-07-02T00:00:00-08:00', '2020-07-07T00:00:00-08:00'];

describe('DateInput', () => {
  beforeEach(createPortal);

  afterEach(cleanup);

  test('should have no accessibility violations', async () => {
    const { container } = render(
      <Grommet>
        <DateInput format="mm/dd/yyyy" a11yTitle="axe test" />
      </Grommet>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('basic', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput id="item" name="item" value={DATE} />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('format', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput id="item" name="item" format="mm/dd/yyyy" value={DATE} />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('inline', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput id="item" name="item" inline value={DATE} />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('format inline', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          inline
          value={DATE}
        />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('format disabled', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          disabled
          value={DATE}
        />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('range', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput id="item" name="item" value={DATES} />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('range inline', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput id="item" name="item" value={DATES} inline />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('range format', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy-mm/dd/yyyy"
          value={DATES}
        />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('range format inline', () => {
    const component = renderer.create(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy-mm/dd/yyyy"
          value={DATES}
          inline
        />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  test('dates initialized with empty array', () => {
    const onChange = jest.fn(event => event.value);
    // month is indexed from 0, so we add one
    let month = new Date().getMonth() + 1;
    if (month < 10) month = `0${month}`;

    const year = new Date().getFullYear();

    let timezoneOffset = new Date().getTimezoneOffset() / 60;
    if (timezoneOffset < 10) timezoneOffset = `0${timezoneOffset}`;

    const { container, getByText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          value={[]}
          inline
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('20'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith([
      `${year}-${month}-20T${timezoneOffset}:00:00.000Z`,
      `${year}-${month}-20T${timezoneOffset}:00:00.000Z`,
    ]);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('focus', () => {
    const onFocus = jest.fn();
    const { container, getByPlaceholderText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          value={DATE}
          onFocus={onFocus}
        />
      </Grommet>,
    );

    fireEvent.focus(getByPlaceholderText('mm/dd/yyyy'));
    expect(container.firstChild).toMatchSnapshot();
    expectPortal('item__drop').toMatchSnapshot();
    expect(onFocus).toHaveBeenCalled();

    fireEvent.keyDown(getByPlaceholderText('mm/dd/yyyy'), {
      key: 'Esc',
      keyCode: 27,
      which: 27,
    });
    expect(document.getElementById('item__drop')).toBeNull();
  });

  test('select inline', () => {
    const onChange = jest.fn(event => event.value);
    const { container, getByText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          value={DATE}
          inline
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('20'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith('2020-07-20T08:00:00.000Z');
  });

  test('select format inline', () => {
    const onChange = jest.fn(event => event.value);
    const { container, getByText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          value={DATE}
          inline
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('20'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith('2020-07-20T08:00:00.000Z');
    expect(container.firstChild).toMatchSnapshot();
  });

  test('select format', () => {
    const onChange = jest.fn(event => event.value);
    const { container, getByPlaceholderText, getByText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          value={DATE}
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.focus(getByPlaceholderText('mm/dd/yyyy'));
    expect(container.firstChild).toMatchSnapshot();
    expectPortal('item__drop').toMatchSnapshot();

    fireEvent.click(getByText('20'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith('2020-07-20T08:00:00.000Z');
    expect(document.getElementById('item__drop')).toBeNull();
  });

  test('type format inline', () => {
    const onChange = jest.fn(event => event.value);
    const { container, getByPlaceholderText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy"
          value={DATE}
          inline
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('mm/dd/yyyy'), {
      target: { value: '07/21/2020' },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('select format inline range', () => {
    const onChange = jest.fn(event => event.value);
    const { container, getByText } = render(
      <Grommet>
        <DateInput
          id="item"
          name="item"
          format="mm/dd/yyyy-mm/dd/yyyy"
          range
          value={DATES}
          inline
          onChange={onChange}
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();

    // new calendar logic adjust start date by default
    fireEvent.click(getByText('10'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith([
      '2020-07-10T08:00:00.000Z',
      '2020-07-10T08:00:00.000Z',
    ]);
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`dropProps should pass props to Drop 
  when not inline`, () => {
    const { container } = render(
      <Grommet>
        <DateInput
          dropProps={{
            plain: true,
          }}
          format="mm/dd/yyyy"
        />
      </Grommet>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test(`buttonProps should pass props to Button 
  when not inline and no format`, () => {
    const component = renderer.create(
      <Grommet>
        <DateInput
          buttonProps={{
            open: true,
            disabled: true,
          }}
        />
      </Grommet>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });
});
