import { Plugin, Transaction } from "prosemirror-state";
import Extension from "../lib/Extension";
import Bold from "../marks/Bold";
import Hidden from "../marks/Hidden";

export default class Filter extends Extension {
    get name(){
        return "Filter"
    }

    get plugins() {
        return[
            new Plugin({
                appendTransaction:  (transactions, oldState, newState) => {
                    //let returnTransaction = null;
                    transactions.forEach(transaction => {
                        let steps = transaction.steps;
                        console.log(steps);
                        steps.forEach(step => {
                            if(step['mark'] !== undefined){
                                //The transform consists of an addition of mark
                                let mark = step['mark'];
                                //If this is a tag Mark
                                if(mark['type']['name'] == "tag"){
                                    //Get the tag type
                                    let tagType = mark['attrs']['name'];
                                    console.log(tagType);
                                    //Ideally pass a method through the constructor, 
                                    //and call our method to get this boolean
                                    let filter = true;
                                    if(filter){
                                        //Not working right now, but trying to add the hidden mark if filter is true
                                        //returnTransaction = new Transaction(newState.doc);
                                        //console.log("Adding Mark");
                                        //console.log(step['from'] + " " + step['to']);
                                        //returnTransaction.addMark(step['from'], step['to'], new Hidden());
                                    }
                                }
                            }
                        })
                    })
                    //return returnTransaction;
                }
            })
        ]
    }
}