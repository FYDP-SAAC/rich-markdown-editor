import * as React from 'react';
import { findChildren } from 'prosemirror-utils';
import { EditorView } from "prosemirror-view";
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import { CloseIcon } from "outline-icons";

type Props = {
    view: EditorView;
};

type TagListProps = {
    key: string;
    selectedKey: string;
    tagName: string;
    deleteTag: () => void 
}

class TagMenu extends React.Component<Props> {

   menuRef = React.createRef<HTMLDivElement>();
   
   state = {
    left: 20,
    top: -1000,
    tag: "",
    position: -1000,
    existingAttrs: {},
    selectedTagKey: ""
  };

  componentDidUpdate(prevProps,prevState) {
    const nextStyle = this.calculatePosition(this.props);
    if(prevState.top != nextStyle.top){
        this.setState({ top: nextStyle.top, left: nextStyle.left, tag: "", position: nextStyle.position, existingAttrs: nextStyle.existingAttrs, selectedTagIndex: "" });
    }
  }

  handleTagChange(event) {
    this.setState({tag: event.target.value})
  }

  addTag(event){
    const { view } = this.props;
    const { state } = view;
    const { tr, selection } = state
    const tagName = this.state.tag 
    var newTags = {}
    for (var key in this.state.existingAttrs){
      newTags[key] = this.state.existingAttrs[key]
    }
    newTags[uuidv4()] = tagName;
    const transaction = tr.setNodeMarkup(this.state.position, undefined, {tags: newTags});
    view.dispatch(transaction);
    this.setState({tag: "", existingAttrs: newTags})
  }
  
  deleteTag(keyToDelete){
    const { view } = this.props;
    const { state } = view;
    const { tr, selection } = state
    const tagName = this.state.tag 
    var newTags = {}
    for (var key in this.state.existingAttrs){
      if(key !== keyToDelete){
        newTags[key] = this.state.existingAttrs[key]
      }
    }
    const transaction = tr.setNodeMarkup(this.state.position, undefined, {tags: newTags});
    view.dispatch(transaction);
    this.setState({existingAttrs: newTags})
  }
  render() {
    return (
        <div>
        <div style={{top: this.state.top, 
                    left: this.state.left, 
                    position: "absolute",
                    background: "#f2f2f4",
                    height: "40px",
                    width: "250px"}}
            ref={this.menuRef}>
            <div style={{width:"90%",
                         margin: "auto",
                         paddingTop: "3%"}}>
              <input placeholder="Tag Name" value={this.state.tag} onChange={this.handleTagChange.bind(this)}/>
              <button style={{float:"right"}} onClick={this.addTag.bind(this)}>Add Tag</button>
           </div>
             <nav style={{top: "0px", 
                    left: "250px", 
                    position: "absolute"}}>
               <ul style={{overflow: "hidden", 
                          overflowY: "scroll", 
                          listStyle: "none", 
                          paddingLeft: "5px",
                          marginTop: "0px"}}>
                {Object.keys(this.state.existingAttrs).map((key, index) => {
                    return <TagItem key={key} selectedKey={this.state.selectedTagKey} tagName={this.state.existingAttrs[key]} deleteTag={() => this.deleteTag(key)}/>
                  })}
               </ul>
             </nav>
        </div>
        </div>
    )
    }

    getScrollTop() {
        return (
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        );
    }
      
   getScrollRight(){
        return (
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0
        );
      }
    
    getOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + this.getScrollTop(),
          right: rect.right
        }
      }
    
    calculatePosition(props) {
      const { view } = props;
      const { state } = view;
      const { selection } = state;
        
      if (!selection) {
        return {
          top: -1000
        }
      }
    
      const { $anchor } = selection;
      const resolvedPos = state.doc.resolve($anchor.pos) as any;
      const rowNumber = resolvedPos.path[1];
      let i = 0;
      if ($anchor.pos === 0) {
        return {
          top: -1000
        }
      }
      const [firstNode] = findChildren(
        state.doc,
        _node => {
          if (rowNumber === i || rowNumber + 1 === i) {
            i++
            return true
          }
          i++
          return false
        },
        false
      )
      if (!firstNode) {
        return {
          top: -1000
        }
      }
    
      const coords = view.coordsAtPos(firstNode.pos);
      const dom = view.nodeDOM(firstNode.pos) as HTMLElement;
      const element = this.getOffset(dom);

      if (coords.top === 0) {
        return {
          top: -1000
        }
      }
      return {
        left: element.right - 250,
        top: element.top - 40,
        position: firstNode.pos,
        existingAttrs: firstNode.node.attrs.tags
      }
    }
}

class TagItem extends React.Component<TagListProps> {
  render() {
    return(
      <li 
      key={ this.props.key }
      className="tagList"
      style={{width: "100px"}}
      >
        <div
          style = {{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgb(78, 92, 110)",
            borderRadius: "5px"
          }}
        >
          <div
          style = {{
            fontFamily: "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace",
            color: "#4E5C6E",
            fontSize: "13px",
            width: "80%",
            textAlign: "center"
          }}>
            {this.props.tagName}
          </div>
          <div
          style={{borderLeft: "1px solid rgb(78, 92, 110)",
                  cursor: "pointer"}}
          onClick={() => this.props.deleteTag()} 
                  >
            <CloseIcon/>
          </div>
        </div>
      </li>
    )
  }
}
export default TagMenu;
