import axios from 'axios';
export class EdenService {
  static async namedEntity(props: { text: string }) {
    const { text } = props;
    const options = {
      method: 'POST',
      url: process.env.EDEN_HOST,
      headers: {
        authorization: `Bearer ${process.env.EDEN_TOKEN as string}`,
      },
      data: {
        providers: 'openai',
        text,
        language: 'en',
        fallback_providers: '',
      },
    };

    try {
      const response = await axios.request<any>(options);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
