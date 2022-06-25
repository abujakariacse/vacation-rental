import React from 'react';
import Banner from './Banner';
import Blogs from './Blogs';
import GetReady from './GetReady';
import Offer from './Offer';
import Reviews from './Reviews';
import Services from '../Shared/Services';
import Rooms from './Rooms';

const Home = () => {
    return (
        <div>
            <Banner />
            <Services />
            <Rooms />
            <Reviews />
            <Offer />
            <GetReady />
            <Blogs />
        </div>
    );
};

export default Home;



