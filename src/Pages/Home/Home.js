import React from 'react';
import Banner from './Banner';
import GetReady from './GetReady';
import OurOffer from './OurOffer';
import HomepageBlogs from '../Home/HomepageBlogs';
import Reviews from './Reviews';
import OurServices from '../Shared/OurServices';
import Rooms from './Rooms';

const Home = () => {
    return (
        <div>
            <Banner />
            <OurServices />
            <Rooms />
            <Reviews />
            <OurOffer />
            <GetReady />
            <HomepageBlogs />
        </div>
    );
};

export default Home;



