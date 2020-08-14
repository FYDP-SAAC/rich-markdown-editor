import * as React from 'react';
import { findChildren } from 'prosemirror-utils';
import { EditorView } from "prosemirror-view";

type Props = {
    view: EditorView;
};

class TagMenu extends React.Component<Props> {

   menuRef = React.createRef<HTMLDivElement>();
   
   state = {
    left: 20,
    top: -1000,
    tag: "",
    position: -1000,
    existingAttrs: [],
    selectedTagIndex: -1
  };

  componentDidUpdate(prevProps,prevState) {
    const nextStyle = this.calculatePosition(this.props);
    if(prevState.top != nextStyle.top){
        this.setState({ top: nextStyle.top, left: nextStyle.left, tag: "", position: nextStyle.position, existingAttrs: nextStyle.existingAttrs, selectedTagIndex: -1 });
    }
  }

  handleTagChange(event) {
    this.setState({tag: event.target.value})
  }

  addTag(event){
    console.log(this.state.tag);
    const { view } = this.props;
    const { state } = view;
    const { tr, selection } = state
    const tagMarkType = state.schema.marks.tag;
    const tagName = this.state.tag 
    var prevAttrs = Array.from(this.state.existingAttrs)
    prevAttrs.push(tagName)
    const transaction = tr.setNodeMarkup(this.state.position, undefined, {tags: prevAttrs});
    view.dispatch(transaction);
    this.setState({tag: "", existingAttrs: prevAttrs})
  }
  
  selectTag(index){
    this.setState({selectedTagIndex: index})
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
                          height:"67px", 
                          paddingLeft: "5px",
                          marginTop: "0px",
                          background: "#f2f2f4"}}>
                {this.state.existingAttrs.map(function(name, index){
                    return <li 
                    // onClick={this.selectTag(index)} 
                    key={ index }
                    // style={{ background: this.state.selectedTagIndex == index ? "white" : "#f2f2f4"}}
                    >{name}</li>;
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
      console.log(rowNumber)
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

export default TagMenu;
