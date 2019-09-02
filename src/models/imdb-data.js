import BaseModel from './base-model';

export default class ImdbData extends BaseModel {
  constructor(props) {
    super(props);
    delete this.id;
    this.fetchDate = props.fetchDate || undefined;
    this.openingThisWeek = props.openingThisWeek || [];
    this.nowPlaying = props.nowPlaying || [];
    this.comingSoon = props.comingSoon || [];
  }
}
