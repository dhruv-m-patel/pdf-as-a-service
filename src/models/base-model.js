export default class BaseModel {
  constructor(props) {
    this.id = props.id || 0;
  }

  getId() {
    return this.id;
  }
}
