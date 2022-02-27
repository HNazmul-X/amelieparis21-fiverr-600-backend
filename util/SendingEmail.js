require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const VerificationModel = require("../Model/VerifictionModel");
const bcrypt = require("bcrypt");

class SendEmail {
    /**
     *
     * @param {*} message {to,from,subject,text,html}
     * @returns
     */
    static sendEmail(message) {
        return new Promise((resolve, reject) => {
            const transport = nodemailer.createTransport({
                host: "server2.onecardpro.com",
                port: 465,
                secure: true,
                auth: {
                    user: "mail@server2.onecardpro.com",
                    pass: "s[,?@GX}mRUI$hQ+zQ",
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            const { to, from, subject, text, html } = message;
            const mailOption = {
                to,
                from: process.env.EMAIL,
                priority: "high",
                date: new Date().toUTCString(),
                subject: subject,
                text,
                html,
            };

            transport.sendMail(mailOption, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    }

    /**
     *
     * @param {*} to receiver .. who will receive the email
     * @param {*} type "v-code","pwd|reset" receiver .. who will receive the email
     * @param {*} callback callbackFunction
     * @returns
     */
    static async SendVerificationEmail(to, type = "v-code", callback) {
        return new Promise(async (resolve, reject) => {
            const code = crypto.randomBytes(4).toString("hex");

            /* Templates of email sending */
            const reset_PwdTemplate = `<div style="
				background-color: #e7e9ee;
				padding-bottom: 30px;
				font-family: Verdana, Geneva, Tahoma, sans-serif;
			">
		<div style="
				background-color: #183170;
				text-align: center;
				padding: 20px;
				">
			<img style="width: 100px;display:block;margin:auto" src="https://i.ibb.co/8KTHvnn/Asset-1-2x-ccexpress.png" alt="">
		</div>
		<div style="text-align: center; margin-top: 20px">
			<img src="https://i.ibb.co/rf9VFSK/Group-2.png" style="width: 200px; margin-bottom: 20px;" alt="" />
			<h3 style="
					color: #57697d;
					font-size: 50px;
					margin: 0px 0 7px;
					padding: 0 10px;
				">
				Reset Your Password
			</h3>
			<p style="color: #57697d; margin: 0; padding: 0 10px; font-size: 30px">
				Your code is
			</p>
			<h2 style="
					color: #57697d;
					font-size: 70px;
					padding: 0 10px;
					margin: 15px 0;
					max-width: max-content;
					background:rgb(94, 108, 189);
					color:white;
					margin: 10px auto;

					font-family:jetbrains mono,firacode,consolas,monospace;
				">
				${code}
			</h2>
			<p style="color: #57697d; font-size: 27px; padding: 0 10px; margin: 0">
				Copy the code and Paste to the website
			</p>
			<hr style="max-width: 800px; width: 80%" />
		</div>
	</div>`;
            const verification_template = `<div style="margin:0 auto;max-width:800px;padding:0;background-color:#f7faff">
		<div style="background-color:#f7faff;padding-bottom:30px;font-family:Verdana,Geneva,Tahoma,sans-serif">
			<div style="background-color:#132d63;padding:10px 0 15px; width:100%;text-align:center">
            <img style="width: 100px;display:block;margin:auto" src="https://i.ibb.co/8KTHvnn/Asset-1-2x-ccexpress.png" alt=""> 
				
			</div>
			<div style="text-align:center;margin-top:40px;margin-bottom:40px">
				<img src="https://i.ibb.co/TYrg2vR/Frame.png" style="width:200px;height:200px;margin-bottom:20px" alt="" class="CToWUd a6T" tabindex="0">
				<div class="a6S" dir="ltr" style="opacity: 0.01; left: 527px; top: 363.047px;">
					<div id=":1ej" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download">
						<div class="akn">
							<div class="aSK J-J5-Ji aYr"></div>
						</div>
					</div>
				</div>
				<h3 style="color:#57697d;font-size:50px;margin:0px 0 7px;padding:0 10px">
					vérifier votre profil
					code
				</h3>
				<p style="color:#57697d;margin:0;padding:0 10px;font-size:30px">
					Your code is
				</p>
				<h2 style="color:#21344b;font-size:70px;padding:0 10px;margin:15px auto;font-family:jetbrains mono,consolas,firacode,monospace;background:#c4c9cf;width:max-content">
					${code}
				</h2>
				<p style="color:#57697d;font-size:27px;padding:0 10px">
					Copy the code and Paste to the website
				</p>
				<hr style="max-width:800px;width:80%;margin-top:20px">
				<div class="yj6qo"></div>
				<div class="adL">
				</div>
			</div>
			<div class="adL">
			</div>
		</div>
		<div class="adL">
		</div>
										   </div>`;

            const option = {
                to,
                title: "Verification Code From OneCardPro.com",
                subject: `Verification Code for ${to}`,
                text: `Verification Code for ${to}`,
                html: type === "v-code" ? verification_template : type === "pwd|reset" ? reset_PwdTemplate : null,
            };
            try {
                const isMessageSend = await SendEmail.sendEmail(option);
                if (isMessageSend?.accepted.length > 0) {
                    if (callback) {
                        callback();
                    }
                    const hashedPassword = await bcrypt.hash(code, 5);
                    console.log({hashedPassword})
                    const verification = new VerificationModel({ code: hashedPassword }).save();
                    resolve(verification);
                } else {
                    reject({ error: "email didn't send, please provide a valid user" });
                }
            } catch (e) {
                resolve(e);
            }
        });
    }

    static async verifyCode(code, id) {
        if (code && id) {
            const data = await VerificationModel.findById(id);
           
            if (!data) {
                console.log("data not found")
                return false;
            } else {
                const isPasswordMatched = await bcrypt.compare(code, data?.code);
                console.log("data found",data?.code)
                if (isPasswordMatched && !data?.isUsed) {
                    console.log("password matched")
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

module.exports = SendEmail;
