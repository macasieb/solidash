import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';
import { statements2vis } from '../helpers/import-export.js';

// Extend the LitElement base class
class EditorComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      body: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.sfh = new SolidFileHelper()
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "fileUriChanged":
          // code block
          app.fileUriChanged(message.file)
          break;
          case "folderUriChanged":
          // code block
          app.folderUriChanged(message.folder)
          break;
          case "sessionChanged":
          // code block
          app.sessionChanged(message.webId)
          break;
          case "setValue":
          // code block
          app.setValue(message.text)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {
    return html`

    <h1>${this.name}</h1>
    <p>Current File :
    <input id="filePath" value=${this.uri} size="55">
    <button @click=${this.clickUpdate} ?disabled=${this.webId==null} >Save</button>
    </p>

    <textarea
    rows="20"
    cols="100"
    id="textarea"
    @change=${this.textareaChanged}>
    </textarea>


    `;
  }

  fileUriChanged(file){
    var app = this
    this.uri = file.uri
    console.log(file)
    var extension = this.uri.split('.').pop();
    switch (extension) {
      case 'json':
      case 'html':
      case 'ttl':
      case 'txt':
      case 'rdf':
      case 'owl':
      this.sfh.readFile(this.uri)
      .then(
        body => {
          app.body = body
          app.shadowRoot.getElementById("textarea").value = body
          console.log("File Body",app.body)
          file.content = body
          this.agent.send('Spoggy', {action:"updateFromFile", file:file });
        }, err => {
          console.log(err)
        })
        break;
        default:
        console.log("ce type de fichier n'est pas encore pris en compte : ",extension)
      }

    }

    folderUriChanged(folder){
      var app = this
      this.uri = folder.uri
    }


    setValue(text){
      this.shadowRoot.getElementById("textarea").value = text
    }




    textareaChanged(event) {
      console.log("change")
      //  this.count++
      //console.log(event.target);
      //  console.log(this.agent)
      //  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
    }

    sessionChanged(webId){
      this.webId = webId
      console.log(this.webId)
    }

    clickUpdate(){
      var app = this;
      var content = this.shadowRoot.getElementById("textarea").value
      var filePath = this.shadowRoot.getElementById("filePath").value
      console.log("uri",filePath)
      this.sfh.updateFile(filePath, content)
      .then(
        success => {
          console.log( "Updated", filePath, success)
        }, err => {
          console.log(err)
        })

      }
    }

    // Register the new element with the browser.
    customElements.define('editor-component', EditorComponent);
