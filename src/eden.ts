import axios from 'axios';
const edenToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTNhNmFhMTctZGI2My00M2JiLWI3OWUtNWE4ZDYxZmVmZjYyIiwidHlwZSI6ImFwaV90b2tlbiJ9.qT3Ngd_s07m0riQkJqdgkb02QM_B1HltwdAZ7zVhYAY';
const options = {
  method: 'POST',
  url: 'https://api.edenai.run/v2/text/named_entity_recognition',
  headers: {
    authorization: `Bearer ${edenToken}`,
  },
  data: {
    providers: 'openai',
    text: 'this is a test',
    language: 'en',
    fallback_providers: '',
  },
};

axios
  .request(options)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
