import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import EventStore from '../eventstore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'title',
  label: 'Title',
  placeholder: 'Insert Title',
  rules: 'required|string'
}, {
  name: 'numberAttendies',
  label: 'nombre de présents',
  placeholder: 'nombre de présents',
  rules: 'required',
}, {
  name: 'type',
  label: 'Event Type',
  placeholder: 'Choose an event type',
  rules: 'required|string',
}, {
  name: 'place',
  label: 'Event Place',
  placeholder: 'Please type a place for your event',
  rules: 'required|string',
},{
  name: 'start_date',
  label: 'Start Date',
  placeholder: 'Choose a starting date',
  rules: 'required|date',
}, {
  name: 'end_date',
  label: 'End Date',
  placeholder: 'Choose an Ending date',
  rules: 'required|date',
}];

const hooks = {
  onSuccess(form) {
    // get field values
    console.log('Form Values!', form.values());
    EventStore.addNewEvent(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    console.log(form.values())
    // get all form errors
  //  console.log('All form errors', form.errors());
}
}

export default new MobxReactForm({ fields }, { plugins, hooks });
