<template>
  <div id="loginWrap">
		<div class="login-bg"></div>
		<div class="login-container">
			<div class="login-box">
				<div class="login-title">登录</div>
				<div class="login-con">
					<form class="login-form">
						<div class="login-input">
							<input type="text" placeholder="请输入邮箱" v-model="email">
						</div>
						<div class="login-input">
							<input type="password" placeholder="请输入密码" v-model="password">
						</div>
						<div class="login-input-validate">
							<input type="text" placeholder="请输入验证码" v-model="captcha">
							<img :src="imgSrc" alt="" @click="getVerificationCode">
						</div>
						<div class="login-error">
							<div class="error-tip">{{errorMessage}}</div>
						</div>
						<div class="login-btn" @click="login">登录</div>
					</form>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import { uuid } from '@/common/util'
export default {
  	name: 'Login',
  	data() {
    	return {
			token: '',
			imgSrc: '',
			email: '',
			password: '',
			captcha: '',
			errorMessage: ''
		}
	},
	created() {
		this.getVerificationCode();
	},
	methods: {
		//获取验证码
		async getVerificationCode() {
			this.token = uuid();
			await this.$axios({
				method: 'get',
				url: '/api/v1/auth/captcha',
				params: {
					token: this.token
				},
				responseType: 'blob'
			}).then(res => {
				this.imgSrc = window.URL.createObjectURL(res.data);
			})
		},
		async login() {
			if(this.email === '') {
				this.errorMessage = "请输入邮箱";
			}else if(this.password === '') {
				this.errorMessage = "请输入密码";
			}else if(this.captcha === '') {
				this.errorMessage = "请输入验证码";
			}else {
				await this.$axios({
					method: 'post',
					url: '/api/v1/auth/login',
					data: {
						email: this.email,
						token: this.token,
						captcha: this.captcha,
						password: this.password
					},
				}).then(res => {
					window.sessionStorage.setItem("access_token",res.data.data.tokens.access_token);
					window.sessionStorage.setItem("refresh_token",res.data.data.tokens.refresh_token);
					window.sessionStorage.setItem("login_date",new Date().getTime());
					let redirect = this.$route.query.redirect;
					if(redirect) {
						this.$router.push(redirect);
					}else {
						this.$router.push('/home/users');
					}
				}).catch(err => {
					this.errorMessage = err.message;
					this.getVerificationCode();
				})
			}
		}
	}
}
</script>

<style scoped lang = "less">
	#loginWrap {
		height: 100vh;
	}
	.login-bg {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: linear-gradient(to right,#267aa9,#72a8c5);
		z-index: -1000;
	}
	.login-container {
		height: 100%;
		width: 100%;
		min-height: 600px;
		min-width: 600px;
		overflow: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login-box {
		width: 350px;
		height: 398px;
		background: #fff;
		border-radius: 4px;
		padding: 35px 20px 0px 20px;
	}
	.login-title {
    padding: 20px 0 24px 33px;
    font-size: 24px;
	}
	.login-con {
		padding: 0 25px;
	}
	.login-input {
		padding-top: 18px;
	}
	.login-input input {
		width: 260px;
    height: 32px;
    padding-left: 10px;
    background-color: #F8F9FA;
    border: 1px solid #E0E0E0;
    outline: none;
	}
	.login-error {
		padding-top: 10px;
	}
	.error-tip {
		font-size: 12px;
		color: red;
	}
	.login-btn {
		margin: 20px 0;
    width: 260px;
    height: 38px;
    font-size: 14px;
    line-height: 38px;
    background-color: #1188DD;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
	}
	.login-input-validate {
		display: flex;
		align-items: center;
		padding-top: 18px;
	}
	.login-input-validate input {
		width: 180px;
    height: 32px;
		padding-left: 10px;
		margin-right: 10px;
    background-color: #F8F9FA;
    border: 1px solid #E0E0E0;
    outline: none;
	}
	.login-input-validate img {
		height: 32px;
		width: 70px;
		cursor: pointer;
	}
</style>