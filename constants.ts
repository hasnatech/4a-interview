import { Question } from './types';

export const QUESTIONS_BASE: Question[] = [
  {
    id: 'fullName',
    label: "Let's start with your full name.",
    type: 'text',
    placeholder: 'e.g., Jane Doe',
  },
  {
    id: 'email',
    label: 'Great! What is your email address?',
    type: 'email',
    placeholder: 'e.g., jane.doe@example.com',
  },
  {
    id: 'phone',
    label: 'And a phone number we can reach you at?',
    type: 'tel',
    placeholder: 'e.g., (555) 123-4567',
  },
  {
    id: 'portfolio',
    label: 'Share your linkedin profile url.(optional)',
    type: 'url',
    placeholder: 'e.g., https://linkedin.com/in/jane-doe',
    isOptional: true,
  },
];

export const APPLICANT_TYPE_QUESTION: Question = {
    id: 'applicantType',
    label: 'Are you an experienced professional or a fresher?',
    type: 'radio',
    placeholder: '',
    choices: ['Experienced', 'Fresher'],
};

export const EXPERIENCED_QUESTIONS: Question[] = [
  {
        id: 'yearOfExperience',
        label: 'What is your years of experience?',
        type: 'text',
        placeholder: 'e.g., 5 years',
    },
    {
        id: 'noticePeriod',
        label: 'What is your notice period?',
        type: 'text',
        placeholder: 'e.g., 30 days, Immediately available',
    },
    {
        id: 'currentCTC',
        label: 'What is your current CTC (Cost To Company)?',
        type: 'text',
        placeholder: 'e.g., 10 LPA',
    },
    {
        id: 'expectedCTC',
        label: 'And what is your expected CTC?',
        type: 'text',
        placeholder: 'e.g., 15 LPA',
    },
];

export const FRESHER_QUESTIONS: Question[] = [
    {
        id: 'learningInterests',
        label: 'What are your work-related learning interests?',
        type: 'textarea',
        placeholder: 'e.g., Web development, Machine learning...',
    },
    {
        id: 'graduationYear',
        label: 'When did you complete your college degree?',
        type: 'number',
        placeholder: 'e.g., 2024',
    },
    {
        id: 'aiKnowledge',
        label: 'Tell us about your AI knowledge and experience.',
        type: 'textarea',
        placeholder: 'e.g., I have a basic understanding of AI and its applications.',
        maxlength: 500,
    },
];

export const COMMON_QUESTIONS: Question[] = [
    {
        id: 'city',
        label: 'Which city do you live in?',
        type: 'text',
        placeholder: 'e.g., San Francisco',
    },
];

export const FINAL_QUESTIONS: Question[] = [
  {
    id: 'bio',
    label: 'Tell us a bit about yourself. What makes you a great fit?',
    type: 'textarea',
    placeholder: 'Describe your skills, experience, and passion...',
    maxlength: 500,
  },
  {
    id: 'resume',
    label: 'Please upload your resume.',
    type: 'file',
    placeholder: 'Upload Resume (PDF, DOC)',
  },
  // {
  //   id: 'photo',
  //   label: 'Finally, please upload a professional photo. (Optional)',
  //   type: 'file',
  //   placeholder: 'Click to upload a photo',
  //   isOptional: true,
  // },
];