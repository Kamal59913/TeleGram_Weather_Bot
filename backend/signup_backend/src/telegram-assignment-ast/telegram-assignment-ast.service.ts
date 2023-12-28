import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/book/schema/subscribe.schema';
import { Api } from 'src/book/schema/api.schema';
import { Cron } from '@nestjs/schedule';
const TelegramBot = require('node-telegram-bot-api');


const inlineKeyboardMarkup = {
    inline_keyboard: [
        [{ text: 'Subscribe', url: 'https://ed51-2409-40e6-37-d98e-7d05-e06f-e42c-3cc6.ngrok-free.app/' }]
    ]
};
const Tele_Token = "6815935158:AAFtgo9kj59I8LumUX5xdkAAe6aq0b3MALo"
const fetchetails = async (place: string, UserId: string, apiId: string, sendMessage: (userID: string, message: string) => void) => {
    const apiValue = apiId;

    let url=`https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${apiValue}`;
    const res= await fetch(url);
    const data= await res.json();
    // console.log(data);
    const userId = await UserId;
    const message = await data.message;
    if(message != 'city not found'){
        const { main } = data; // Destructuring the 'main' object from the 'data'
            const { temp, humidity, pressure } = main; // Destructuring specific properties from 'main'
            // console.log(temp);
            // console.log(humidity);
            // console.log(pressure);
            // console.log(userId);
            // Additional data destructuring if needed
            const { main: weathermood } = data.weather[0];
            const { name } = data;
            const { speed } = data.wind;
            const { country, sunset } = data.sys;
        
                const message =  `The <b>${name}'s</b> temperature is <b>${temp}°C </b>
                \n<b>+</b> 🌤️ Humidity <b>${humidity}%</b>
                \n<b>+</b> 💧 Pressure <b>${pressure}</b>
                \n<b>+</b> 🌬️ Wind Speed <b>${speed}m/s</b>
                \n<b>+</b> 🌅 Sunset <b>${sunset}</b>
                \n<b>+</b> 🌍 Country <b>${country}</b>
                \n<b>Subscribe!!! for Daily Weather updates</b>
                \n<b>/PlaceName for daily weather updates</b>
                \n<b>For Unsubscribe: /Unsubscribe</b>
                `;
                sendMessage(userId, message);
    } else {
        sendMessage(userId, "Oops Please write a correct City Name 😥");
    }
} 
     

@Injectable()
export class TelegramAssignmentAstService {
    private readonly bot: any
    private readonly logger = new Logger(TelegramAssignmentAstService.name)
    constructor(@InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Api.name)
    private apiModel: mongoose.Model<Api>,
    ){
        this.bot = new TelegramBot(Tele_Token, {polling: true})
        this.bot.on("message",this.onRecieveMessage)
        this.initializeScheduler(); // Start the scheduler when the service is constructed
    }

    initializeScheduler() {
        setInterval(() => {
            this.scheduleDailyWeatherUpdates();
        }, 20000); // 30 seconds interval (30000 milliseconds)
    }
    async scheduleDailyWeatherUpdates() {
        try {
            let UniqueId= process.env.API_MONGODB_OBJECT_ID;
            const Apistring = await this.getApiString(UniqueId);
         
            const users = await this.userModel.find();
            for (const user of users) {
                if(user.isBlocked == false && user.isSubscribed == true) {
                    fetchetails(user.location, user.tele_id, Apistring , this.sendMessageToUser.bind(this)); // Send weather updates to each user
                }
            } 
        } catch (error) {
            this.logger.error(`Failed to send daily weather updates: ${error.message}`);
            console.log('The user have not yet subscribed')
        }
    }
    async handleSubscription(chatId: string, defaultplace: string, username: string) {
            try {
                const existingUser = await this.userModel.findOne({tele_id:chatId});
                if (existingUser && existingUser.isBlocked == false) {
                    console.log("true, city exists",defaultplace)
                    username = username,
                    existingUser.location = defaultplace,
                    existingUser.tele_id = chatId;
                    existingUser.isSubscribed = true;
                    await existingUser.save();
                } else {
                    const newUser = new this.userModel({ 
                        username: username,
                        location: defaultplace,
                        tele_id: chatId,
                        isSubscribed: true,
                    });
                    await newUser.save();
                }
            } catch (error) {
                this.logger.error(`Failed to handle subscription: ${error.message}`);
                console.log("Unable to save",error)
            }
         
    }
    async checkCity(api: string, chatId: string, city:string, name:string){
        console.log("found found found")
        let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api}`;
        const res= await fetch(url);
        const data= await res.json();
        const message = await data.message;
        if(message != 'city not found') {
            console.log(message,"HiHIHI", chatId,city,name)
            this.handleSubscription(chatId,city,name)
            fetchetails(city, chatId, api, this.sendMessageToUser.bind(this)); // Pass sendMessageToUser function reference
        }
}

async removeUserSubscription(chatId: string) {
        try {
            const existingUser = await this.userModel.findOne({tele_id:chatId});
            if (existingUser) {
                existingUser.isSubscribed = false,
                await existingUser.save();
                console.log("Sucessfulle saved")
            } 
        } catch (error) {
            this.logger.error(`Failed to handle subscription: ${error.message}`);
            console.log("Unable to save",error)
        }
     
}

async createADocumentforApi(UniqueId:String){
    try {
        const existingDocument = await this.apiModel.findById(UniqueId);
        if(!existingDocument) {
            const newDocument = new this.apiModel({
                _id : UniqueId,
                api : process.env.API_OF_WEATHER
            });
            await newDocument.save();
        }
    } catch (error) {
        console.log('Document already exists for API');
    }
}
async getApiString(UniqueId: string): Promise<string | undefined> {
    const apiData = await this.apiModel.findById(UniqueId);
    if (!apiData) {
        await this.createADocumentforApi(UniqueId);
    }
    const apiNewData = await this.apiModel.findById(UniqueId);
    if (apiNewData) {
        return apiNewData.api;
    }
    return undefined;
}

onRecieveMessage = async (msg: any) => {
        const users = await this.userModel.find();
        let UniqueId= process.env.API_MONGODB_OBJECT_ID;
        const Apistring = await this.getApiString(UniqueId);

        const place = msg.text;
        if(place!='/start' && place!='/PlaceName' && place!='/Stop') {
            if(place.startsWith('/')){
                const trim = msg.text.trim(); //Remove extra spaces
                const cityName = trim.slice(1);
                this.checkCity(Apistring, msg.chat.id, cityName, msg.from.first_name );
            } else {
                fetchetails(place, msg.chat.id, Apistring, this.sendMessageToUser.bind(this)); // Pass sendMessageToUser function reference
            }
        } 
        if(place == '/start'){
            this.bot.sendMessage(msg.chat.id, "Welcome to the Bot, Please Write a place name ☀️"); // Pass sendMessageToUser function reference
        } 
        else if(place == '/PlaceName') {
            this.bot.sendMessage(msg.chat.id, `Hi 😥 write a placename Example:
            \n/Delhi
            \n/Chennai
            \n/London
            `); // Pass sendMessageToUser function reference
        }
        else if(place == '/Unsubscribe' ||place == '/unsubscribe') {
            if(users) {
                this.removeUserSubscription(msg.chat.id);
                // console.log(msg.chat.id)
                this.bot.sendMessage(msg.chat.id, "You have Sucessfully Unsubscribed"); // Pass sendMessageToUser function reference
            }
            else {
                console.log("Users Do not exists to Unsubscribe");
            }
        }
    }
    sendMessageToUser = (userID: string, message: string) => {
        this.bot.sendMessage(userID, message,{ parse_mode: 'HTML',
        reply_markup: inlineKeyboardMarkup
    });
    }
}
