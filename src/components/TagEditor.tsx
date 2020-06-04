import * as React from "react";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import { TrashIcon } from "outline-icons";
import styled, { withTheme } from "styled-components";
import theme from "../theme";
import Flex from "./Flex";
import Input from "./Input";
import ToolbarButton from "./ToolbarButton";


type Props = {
    mark: Mark;
    from: number;
    to: number;
    tooltip: typeof React.Component;
    view: EditorView;
    theme: typeof theme;
  };

  class TagEditor extends React.Component<Props>{
    discardInputValue = false;
    initialValue: string = this.props.mark.attrs.name;
    state = {
        value: this.props.mark.attrs.name,
    };

    handleChange = async (event): Promise<void> => {
        const value = event.target.value.trim();
        this.setState({value});
    };

    componentWillUnmount = () => {
        // If we discarded the changes then nothing to do or already saved
        if (this.discardInputValue || this.state.value === this.initialValue) {
          return;
        }
        // If the name is empty remove the mark
        let name = (this.state.value || "").trim();
        if (!name) {
          return this.handleRemoveTag();
        }
        //Save the changes
        this.save(name);
      };
    
    save = (name: string): void => {
        this.discardInputValue = true;
        const { from, to } = this.props;
        const { state, dispatch } = this.props.view;
        const markType = state.schema.marks.tag;

        dispatch(
            state.tr
            .removeMark(from, to, markType)
            .addMark(from, to, markType.create({ name }))
        );
    };

    handleRemoveTag = (): void => {
        this.discardInputValue = true;
        const { from, to, mark } = this.props;
        const { state, dispatch } = this.props.view;
    
        dispatch(state.tr.removeMark(from, to, mark));
    };    

    render() {
        const { mark } = this.props;
        const Tooltip = this.props.tooltip;
    
        return (
          <Wrapper>
            <Input
              value={this.state.value}
              placeholder="Search or paste a link…"
              onChange={this.handleChange}
              autoFocus={mark.attrs.name === ""}
            />
            <ToolbarButton onClick={this.handleRemoveTag}>
              <Tooltip tooltip="Remove Tag" placement="top">
                <TrashIcon color={this.props.theme.toolbarItem} />
              </Tooltip>
            </ToolbarButton>
          </Wrapper>
        );
      }
  }

  const Wrapper = styled(Flex)`
  margin-left: -8px;
  margin-right: -8px;
  min-width: 336px;
`;

export default withTheme(TagEditor);
