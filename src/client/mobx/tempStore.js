import { observable, action, computed, useStrict } from 'mobx';


class TemporaryStore {
    @observable chipData = [];
    @observable invited_guests = [];
    @observable names = [];
    @observable number_guests = 0;

    @action addGuest = (item) => {
        this.chipData.push(item);
        this.names.push(item._id);
        this.number_guests= this.number_guests+1;
        let index = this.invited_guests.indexOf(item);
        this.invited_guests.splice(index, 1);
    }
    @action removeGuest = (item) => {
        let index = this.chipData.indexOf(item);
        this.chipData.splice(index, 1);
        this.names.push(item._id);
        this.number_guests= this.number_guests-1;
        this.invited_guests.push(item);
    }

    @action initGuestList=(list)=>{
        // console.log(list)
        this.invited_guests =[...list];
    }
   
}
const store = new TemporaryStore();

export default store;
export { TemporaryStore };