import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import UserStore from '../gueststore'
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'name',
  label: 'name',
  placeholder: 'Get a name',
  rules: 'required|string'
},
{
  name: 'forname',
  label: 'forname',
  placeholder: 'Get a forname',
  rules: 'required|string'
},{
  name: 'cin',
  label: 'cin',
  placeholder: 'Get a cin',
  rules: 'required|string'
},{
  name: 'tel',
  label: 'tel',
  placeholder: 'Get a tel',
  rules: 'required|string'
},{
  name: 'function',
  label: 'function',
  placeholder: 'Get a function',
  rules: 'required|string'
},{
  name: 'region',
  label: 'region',
  placeholder: 'Get a region',
  rules: 'required|integer'
},{
  name: 'gouvernorat',
  label: 'gouvernorat',
  placeholder: 'Get a gouvernorat',
  rules: 'required|string'
}, {
  name: '_id',
  type : 'hidden',}];

const hooks = {
  onSuccess(form) {
    UserStore.UpdateUserInfoWithProfileData(form.values())
  },
  onError(form) {
    alert('Form has errors!');
    console.log(form.errors())
    // get all form errors
  //  console.log('All form errors', form.errors());
  }

}

export default new MobxReactForm({ fields }, { plugins, hooks });
