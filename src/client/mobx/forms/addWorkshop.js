import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import WorkshopStore from '../workshopstore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'name',
  label: 'Title',
  placeholder: 'Insert Title',
  rules: 'required|string'
}];

const hooks = {
  onSuccess(form) {
    // get field values
    console.log('Form Values!', form.values());
    WorkshopStore.addNewWorkshop(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    console.log(form.values())
    // get all form errors
  //  console.log('All form errors', form.errors());
  }
}

export default new MobxReactForm({ fields }, { plugins, hooks });
