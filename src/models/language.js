import BaseModel from './base-model';

export default class Language extends BaseModel {
  constructor(props) {
    super(props);
    this.language = props.language || '';
  }
}
