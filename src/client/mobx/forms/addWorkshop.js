import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import WorkshopStore from '../workshopstore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'name',
  label: 'Title',
  placeholder: 'Insert Title',
  rules: 'required|string'
},
{
  name: 'users',
  type : 'hidden',
  rules: 'required',
  value: [],
}];

const hooks = {
  onSuccess(form) {
    WorkshopStore.addNewWorkshop(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    console.log(form.values())
    // get all form errors
  //  console.log('All form errors', form.errors());
  },
  onAddAgent(value  , user , form){
    console.log(value , user , form)
  }

}

export default new MobxReactForm({ fields }, { plugins, hooks });
