type SendError = {
  status: false;
  error: SendErrorPayload;
};

export type SendFiledError = {
  message: string;
  path?: string;
  field: string;
};
export type SendErrorPayload = {
  name: string;
  errors: SendFiledError[] 
};
export default SendError;
