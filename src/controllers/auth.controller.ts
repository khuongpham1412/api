import { Body, Controller, Post } from '@nestjs/common';
import { SigninDTO, SignupDTO } from 'src/dto/request.dto';
import { AuthService } from 'src/services/auth.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() signinDTO: SigninDTO) {
    const token = await this.authService.signin({
      email: signinDTO.email,
      password: signinDTO.password,
    });

    return new HttpResponse({ data: { token } });
  }

  @Post('/signup')
  async signup(@Body() signupDTO: SignupDTO) {
    const { email, password, username } = signupDTO;
    const user = await this.authService.signup({
      email,
      password,
      username,
    });
    return new HttpResponse({
      data: {
        user: await Serialize.user({ user }),
      },
    });
  }
}
