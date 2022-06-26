import React from 'react';
import { Parallax } from 'react-parallax';
import AboutBanner from '../images/Aboutpage-Banner.webp';
import PeopleIcon from '../images/icons/people.png';
import PeopleIconMob from '../images/icons/people-mobile.png';
import Processes from '../images/icons/processes.png';
import ProcessesMob from '../images/icons/processes-mobile.png';
import Culture from '../images/icons/positiveCulture.png';
import CultureMob from '../images/icons/culture-mobile.png';
import Profitability from '../images/icons/profitability.png';
import ProfitabilityMob from '../images/icons/profitability-mobile.png';
import Swal from 'sweetalert2';

const About = () => {
    const hanldlePolicies = () => {
        Swal.fire({
            title: 'Terms & Conditions',
            showCloseButton: true,
            text: 'Check-in - 3:00pm, Check-out - 12:00pm,Child Policy - Children under 5 years old are permitted to share the room without additional charges using existing bedding. Child Policy - Children under 5 years old are permitted to share the room without additional charges using existing bedding.Rollaway Beds - Maximum room occupancy is two persons.Baby Cot/ Crib Hire - Complimentary for a maximum of one child under two years upon request and subject to availability. Breakfast Pricing - Full buffet breakfast at Cafe Bazar is available at USD26 per adult. Airport Shuttle - Please contact our Concierge Team to arrange for shuttle or limousine service at special rates.Parking Fee - Hotel parking is available 24 hours daily and subject to availability. Payment Types - The Hotel accepts Visa, MasterCard, American Express and JCB.Accessibility - Wheelchair-accessible rooms and bathrooms are available. Prior reservation is required.Smoking Rooms - The Hotel has a no-smoking policy within its public areas, rooms and suites. Please speak with our team for designated smoking areas and rooms. Advance Purchase - Please note that reservations for advance purchases are strictly non-refundable. In the event of a refund approved by the hotel management due to unforeseen circumstances, the Hotel will not be held responsible for any foreign currency exchange loss or transaction fee by the issuing bank.',
            showConfirmButton: false,
        });
    }
    return (
        <div className='min-h-screen font-[Poppins] bg-accent'>
            <Parallax bgImage={AboutBanner} strength={500} bgImageStyle={{ height: '600px', width: '100%' }} bgClassName='parallax-image'>
                <div className='parallex-gradient h-96 flex justify-center items-center'>
                    <div>
                        <p className='text-lg text-white text-center mt-14 lg:mt-0'>Home <i className='fa-solid fa-angle-right text-xs'></i>  About <i className='fa-solid fa-angle-right text-xs'></i></p>
                        <h1 className='lg:text-6xl text-4xl font-serif text-white font-semibold lg:mt-16'>About Us</h1>
                    </div>
                </div>
            </Parallax>
            <div className='py-12'>
                <h1 className='lg:text-4xl text-2xl text-center'>Unwind at Vacation Rental <span className='lg:inline hidden'>Dhaka</span></h1>
                <h4 className='text-lg mt-4 lg:mx-14 mx-6 text-justify'>Be inspired by the vibrancy surrounding our premier hotel in Dhaka. Located in the heart of the City Centre, our luxurious accommodation offers a calming respite from the hustle and bustle of downtown Dhaka, where contemporary comfort will refresh your senses. We welcome you with our plush rooms, modern amenities and a promise of peace at Vacation Rental Dhaka.
                    <span>Experience the energy of the city and refresh your senses with our inviting sanctuary. Find out more about our <span className='hover:cursor-pointer font-bold underline' onClick={hanldlePolicies}>Hotel Policies</span> </span>
                </h4>
                <h4 className='text-lg mt-4 text-justify lg:mx-14 mx-6'>
                    Vacation Rental Group is a member of Singapore-listed AOL Group Limited, one of Asia’s most established hotel and property companies with an outstanding portfolio of investment and development properties.

                    Based in Singapore, Vacation Rental Hotels Group owns and/or manages close to 50 hotels, resorts and serviced suites including those under development in 31 cities across Asia, Oceania, North America and Europe.

                    Voted “Best Regional Hotel Chain” by readers in Asia from 2017 to 2021, Vacation Rental Hotels Group comprises three brands: Vacation Rental, PARKROYAL COLLECTION, and PARKROYAL.

                    Sincerity is the hallmark of Vacation Rental Hotels Group. The Group is known to its guests, partners, associates and owners for its sincerity in people and the sense of confidence which alleviates the stresses of today’s complex world.
                </h4>
                <h1 className='text-4xl text-center mt-8'>Vision Blueprint (4Ps)</h1>
                <div className='border-b-4 w-64 border-secondary mx-auto mt-4'></div>
                <div className='py-6 grid lg:grid-cols-2'>
                    <div className='lg:flex justify-between'>
                        <img className='w-72 hidden lg:block' src={PeopleIcon} alt="" />
                        <img className='w-40 mx-auto lg:hidden' src={PeopleIconMob} alt="" />
                        <div className='text-center lg:text-left lg:ml-8 lg:mt-5'>
                            <h3 className='text-2xl'>People</h3>
                            <h5 className='text-base lg:text-justify'>Build and develop aligned and engaged associates to create memorable experiences for guests, associates and communities.</h5>
                        </div>
                    </div>
                    <div className='lg:flex'>
                        <img className='w-72 hidden lg:block' src={Processes} alt="" />
                        <img className='w-40 mx-auto lg:hidden' src={ProcessesMob} alt="" />
                        <div className='text-center lg:text-left lg:ml-8 lg:mt-5'>
                            <h3 className='text-2xl'>Processes</h3>
                            <h5 className='text-base lg:text-justify'>Simple, effective and innovative.</h5>
                        </div>
                    </div>
                    <div className='lg:flex'>
                        <img className='w-72 hidden lg:block' src={Culture} alt="" />
                        <img className='w-40 mx-auto lg:hidden' src={CultureMob} alt="" />
                        <div className='text-center lg:text-left lg:ml-8 lg:mt-5'>
                            <h3 className='text-2xl'>Positive Culture</h3>
                            <h5 className='text-base lg:text-justify'>Create a culture of trust through mutual respect, communication and shared success.</h5>
                        </div>
                    </div>
                    <div className='lg:flex'>
                        <img className='w-72 hidden lg:block' src={Profitability} alt="" />
                        <img className='w-40 mx-auto lg:hidden' src={ProfitabilityMob} alt="" />
                        <div className='text-center lg:text-left lg:ml-8 lg:mt-5'>
                            <h3 className='text-2xl'>Profitability</h3>
                            <h5 className='text-base lg:text-justify'>Sustainable business and profitability.</h5>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;