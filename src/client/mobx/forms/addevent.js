import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import EventStore from '../eventstore';
const plugins = {
  dvr: validatorjs
};

const fields = [{
    name: 'title',
    label: 'عنوان الحدث',
    placeholder: 'أضف عنوان الحدث',
    rules: 'required|string'
  }, {
    name: 'type',
    label: 'نوعية الحدث',
    placeholder: 'اختر نوع الحدث',
  }, {
    name: 'place',
    label: 'مكان الحدث',
    placeholder: 'يرجى كتابة مكان الحدث',
    rules: 'required|string',
  }, {
    name: 'start_date',
    label: 'تاريخ البدء',
    placeholder: 'اختر تاريخ البدء',
    rules: 'required|date',
  }, {
    name: 'end_date',
    label: 'تاريخ الانتهاء',
    placeholder: 'اختر تاريخ الانتهاء',
    rules: 'required|date',
  },
  {
    name: 'file',
    type: 'hidden',
    label: 'اختر ملفا لاستيراد قائمة المدعوين',
    rules: 'required|string',

  }, {
    name: '_id',
    type: 'hidden'
  }
];

const hooks = {
  onSuccess(form) {
    console.log(form.values())
    if (form.values()._id != null && form.values()._id != undefined && form.values()._id != "")
      EventStore.UpdateEvent(form.values())
    else
      EventStore.addNewEvent(form.values())
  },
  onError(form) {
      console.log(form.values())
      console.log('All form errors', form.errors());
  }
}


export default new MobxReactForm({
  fields
}, {
  plugins,
  hooks
});