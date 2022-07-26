import React from 'react';
import Banner from './Banner';
import GetReady from './GetReady';
import OurOffer from './OurOffer';
import HomepageBlogs from '../Home/HomepageBlogs';
import Reviews from './Reviews';
import OurServices from '../Shared/OurServices';
import Rooms from './Rooms';
import auth from '../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from '../Shared/Loader';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return <Loader />
    }
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



