import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover/Popover';
import UnCheckedIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { IDictionary } from '../../constants/interfaces';
import SelectionsPresenter from './selections_presenter';

export interface ISelectFieldProps {
  style?: IDictionary<any>;
  menuProps?: any;
  children?: JSX.Element[];
  value?: any;
  autocompleteFilter?: (filter: string, value: string) => boolean;
  displaySelectionsRenderer?: (value: string, hint: string) => void;
  name?: string;
  hintText?: string;
  className?: string;
  autoComplete?: boolean;
  multiple?: boolean;
  disableSearch?: boolean;
  onSelect?: (selectedMenuItem: any, name: string) => void;
}

export interface ISelectFieldState {
  isOpen: boolean;
  searchText: string;
}

class SelectField extends React.Component<ISelectFieldProps, ISelectFieldState> {

  public static defaultProps: ISelectFieldProps = {
    multiple: false,
    disableSearch: false,
    autoComplete: false,
    autocompleteFilter: (searchText, text) => (
      !text || text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    ),
  };

  public menu: any;
  public searchTextField: any;
  public root: any;

  public componentWillMount(): void {
    this.setState({ isOpen: false, searchText: '' });
  }

  // for debugging/styling purposes, set this to null
  // to disable list autoclosing on clickAway
  public closeMenu(): void {
    this.setState({ isOpen: false, searchText: '' }, () => {
      (findDOMNode(this.root) as HTMLElement).focus();
    });
  }

  public openMenu(): void {
    this.setState({ isOpen: true }, () => {
      this.focusTextField();
    });
  }

  public clearTextField(callback: any): void {
    this.setState({ searchText: '' }, callback);
  }

  public focusTextField(): void {
    if (this.props.children.length > 10) {
      const input = findDOMNode(this.searchTextField).getElementsByTagName('input')[0];
      input.focus();
    }
  }

  public focusFirstMenuItem(): void {
    const firstMenuItem = findDOMNode(this.menu).querySelector('[tabindex="0"]') as HTMLElement;
    firstMenuItem.focus();
  }

  public focusLastMenuItem(): void {
    const menuItems = findDOMNode(this.menu).querySelectorAll('[tabindex]');
    const lastMenuItem = menuItems[menuItems.length - 1] as HTMLElement;
    lastMenuItem.focus();
  }

  /**
   * Main Component Wrapper methods
   */
  public handleClick = (): void => {
    this.openMenu(); // toggle instead of close ? (in case user changes  targetOrigin/anchorOrigin)
  }

  public handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (/ArrowDown|Enter/.test(event.key)) {
      this.openMenu();
    }
  }

  /**
   * Popover methods
   */
  public handlePopoverClose = (reason: any): void => {
    this.closeMenu();  // toggle instead of close ? (in case user changes targetOrigin/anchorOrigin)
  }

  /**
   * SelectionPresenter methods
   */
  public handleTextFieldAutocompletionFiltering = (event: React.FormEvent<{}>, searchText: string): void => {
    this.setState({ searchText }, () => this.focusTextField());
  }

  public handleTextFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case 'ArrowDown':
        this.focusFirstMenuItem();
        break;
      case 'Escape':
        this.clearTextField(undefined);
        this.closeMenu();
        break;
      default: break;
    }
  }

  /**
   * Menu methods
   */
  public handleMenuSelection = (event: __MaterialUI.TouchTapEvent, selectedMenuItem: any): void => {
    const { multiple, onSelect, name } = this.props;
    onSelect(selectedMenuItem, name);
    multiple
      ? this.clearTextField(() => this.focusTextField())
      : this.closeMenu();
  }

  public handleMenuEscKeyDown = (): void => {
    this.closeMenu();
  }

  public handleMenuKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    // if event.stopPropagation(), nothing works, so the correct trigger is the 2nd one
    switch (event.key) {
      case 'ArrowUp':
        this.focusTextField();
        break;
      case 'ArrowDown':
        break;
      case 'PageUp':
        break;
      case 'PageDown':
        this.focusLastMenuItem();
        break;
      default: break;
    }
  }

  public render(): JSX.Element {
    const { value, hintText, multiple, children, style, menuProps,
      autocompleteFilter, displaySelectionsRenderer } = this.props;
    const menuItems = this.state.isOpen && children &&
      children.reduce((nodes, child, index) => {
        if (!autocompleteFilter(this.state.searchText, child.props.label)) {
          return nodes;
        }
        const isSelected = value.includes(child.props.value);
        return [ ...nodes, (
          <MenuItem
            key={index}
            tabIndex={index}
            label={child.props.label}
            value={child.props.value}
            checked={multiple && isSelected}
            leftIcon={(multiple && !isSelected) ? <UnCheckedIcon /> : null}
            primaryText={child.props.label}
            disableFocusRipple
            innerDivStyle={{ paddingTop: 5, paddingBottom: 5 }}
          />)];
      }, []);
    const menuWidth = this.root ? this.root.clientWidth : null;
    const setRootRef = (ref: any) => (this.root = ref);
    const setMenuRef = (ref: any) => (this.menu = ref);
    return (
      <div
        ref={setRootRef}
        tabIndex={0}
        style={{ cursor: 'pointer', border: 'none', ...style }}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        className={this.props.className}
      >
        <SelectionsPresenter
          hintText={hintText}
          value={value}
        />
        <Popover
          open={this.state.isOpen}
          anchorEl={this.root}
          canAutoPosition={false}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          useLayerForClickAway={false}
          onRequestClose={this.handlePopoverClose}
        >
          {children.length > 10 &&
            <TextField
              name="autoComplete"
              ref={ref => (this.searchTextField = ref)}
              value={this.state.searchText}
              hintText={hintText}
              onChange={this.handleTextFieldAutocompletionFiltering}
              onKeyDown={this.handleTextFieldKeyDown}
              style={{ marginLeft: 16, width: menuWidth - 16 * 2, outline: 'none' }}
            />
          }
          <Menu
            ref={setMenuRef}
            {...menuProps}
            value={value}
            multiple={multiple}
            initiallyKeyboardFocused
            onChange={this.handleMenuSelection}
            onEscKeyDown={this.handleMenuEscKeyDown}
            onKeyDown={this.handleMenuKeyDown}
            desktop
            autoWidth={false}
            width={menuWidth}
          >
            {menuItems.length
              ? menuItems
              : <MenuItem primaryText="No match found" disabled />
            }
          </Menu>
        </Popover>
      </div>
    );
  }
}


export default SelectField;
