import { Link } from 'react-router-dom'; 
import farmImg from '../assets/homePic.png';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/Card';
import { ArrowRight, Leaf, Brain, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="relative w-screen">
            <section className="relative w-full h-screen">
                <div className="absolute inset-0">
                    <img 
                        src={farmImg}
                        alt="Modern sustainable farming"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 p-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-black">
                        AgriFuel Nexus
                    </h1>
                </div>
                <div  className="absolute bottom-4 right-4 p-12">
                    <button className='inline-block items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-green-800 transition-colors duration-200 '>
                        <Link to="/dashboard">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </button>
                </div>
            </section>
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Revolutionizing Agriculture
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Combining cutting-edge AI technology with sustainable marketplace solutions
                            to maximize your farm's potential and environmental impact.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Brain className="h-8 w-8 text-green-800" />
                                </div>
                                <CardTitle className="text-xl">AI Farming Advisor</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    Get personalized, real-time recommendations powered by machine learning,
                                    weather forecasts, and soil analytics for optimal farming decisions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-orange-500" />
                                </div>
                                <CardTitle className="text-xl">Marketplace Platform</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    Connect directly with biofuel producers to sell agricultural waste,
                                    bypassing middlemen for fair pricing and sustainable revenue streams.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Leaf className="h-8 w-8 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">Sustainability Impact</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600">
                                    Transform agricultural waste into valuable biofuel, reducing pollution
                                    while creating new income opportunities for farmers.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}