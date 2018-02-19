import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import UserStore from '../gueststore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'username',
  label: 'username',
  placeholder: 'Please provide a username',
  rules: 'required|string'
}, {
  name: 'password',
  label: 'Choose the password',
  placeholder: 'Choose the password',
  rules: 'required|string',
} ,  {
  name: 'rolename',
  label: 'Choose the rolename',
  placeholder: 'Choose the rolename',
  rules: 'required|string',
} ,
{
 name: 'identifiant',
 label: 'Choose the identifiant',
 placeholder: 'Choose the identifiant',
 rules: 'required|string',
}] 
const hooks = {
  onSuccess(form) {
    UserStore.addAgent(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    // get all form errors
  //  console.log('All form errors', form.errors());
}
}

export default new MobxReactForm({ fields }, { plugins, hooks });
