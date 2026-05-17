import { Question, QuestionSet } from 'nest-commander';

const SUPERUSER_QUESTION_KEY = 'superuser-questions';

@QuestionSet({ name: SUPERUSER_QUESTION_KEY })
class SuperuserQuestions {
  @Question({ message: 'Enter first name (optional):', name: 'first_name', default: undefined })
  parseFirstName(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter last name (optional):', name: 'last_name', default: undefined })
  parseLastName(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter phone number:', name: 'phone_number' })
  parsePhoneNumber(val: string) {
    return val;
  }

  @Question({ message: 'Enter email (optional):', name: 'email', default: undefined })
  parseEmail(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter password:', name: 'password', type: 'password' })
  parsePassword(val: string) {
    return val;
  }
}

export { SUPERUSER_QUESTION_KEY };
export default SuperuserQuestions;
