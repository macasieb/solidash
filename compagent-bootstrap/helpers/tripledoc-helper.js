import { Namespaces } from '../helpers/namespaces.js';

export class TripledocHelper {
  constructor() {
    this.ns = new Namespaces()
  }


  getNameFromCard(card){
    //  var module = this;
    var name = Tripledoc.fetchDocument(card).then(
      doc => {
        console.log("doc",doc)
        const subject = card+"#me"
        const person = doc.getSubject(subject);
        console.log("person ", person)
        name = person.getString(this.ns.FOAF("name"))
        console.log("name",name)
        return name
      },
      err =>{
        console.log("erreur ",err)
        return err
      }
    );
    return name;
  }

  getProfileFromCard(card){
    //  card : sans #me, webid avec #me
    let  profile = Tripledoc.fetchDocument(card).then(
      doc => {
        var profile = {}
        let subject = card
        card.endsWith("#me") ? subject = card : subject = card+"#me";
        let person = doc.getSubject(subject);
        //  console.log("person ", person)
        profile.name = person.getString(this.ns.FOAF("name"))
        profile.friends = person.getAllRefs(this.ns.FOAF('knows'))
        profile.publicTypeIndexUrls = person.getAllRefs(this.ns.SOLID('publicTypeIndex'))
        profile.storage = person.getRef(this.ns.SPACE('storage'))
        //  console.log("Friends",friends)
        //  console.log("name",name)
        //  const profile = {name: name, friends: friends, publicTypeIndexUrls: publicTypeIndexUrls}
        return profile
      },
      err =>{
        console.log("erreur ",err)
        return err
      }
    );
    return profile;
  }


}
