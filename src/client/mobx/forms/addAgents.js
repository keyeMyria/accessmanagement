import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import UserStore from '../gueststore';
const plugins = { dvr: validatorjs };

const fields = [{
  name: 'username',
  label: 'اسم المستخدم',
  placeholder: 'يرجى تقديم اسم مستخدم',
  rules: 'required|string'
}, {
  name: 'password',
  type:'password',
  label: 'اختر كلمة المرور',
  placeholder: 'اختر كلمة المرور',
  rules: 'required|string',
} ,  {
  name: 'rolename',
  label: 'اختر اسم الدور',
  placeholder: 'اختر اسم الدور',
  rules: 'required|string',
} ,
{
 name: 'identifiant',
 label: 'اختر المعرف',
 placeholder: 'اختر المعرف',
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
