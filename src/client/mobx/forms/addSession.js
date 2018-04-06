import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import EventStore from '../eventstore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'title',
  label: 'عنوان الورشة',
  placeholder: 'ادخل عنوان الجلسة',
  rules: 'required|string',
  default : 'جلسة عامة'
}, {
  name: 'eventid',
  type : 'hidden'
}];

const hooks = {
  onSuccess(form) {
    console.log(form.values())
    EventStore.startSessionForEvent(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    console.log(form.values())
    // get all form errors
  //  console.log('All form errors', form.errors());
  }
}

export default new MobxReactForm({ fields }, { plugins, hooks });
