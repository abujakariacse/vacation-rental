import React from 'react';
import Banner from './Banner';
import GetReady from './GetReady';
import OurOffer from './OurOffer';
import HomepageBlogs from '../Home/HomepageBlogs.jsx';
import Reviews from './Reviews';
import Rooms from './Rooms';
import auth from '../../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from '../Shared/Loader.jsx';

const Home = () => {
    const [user, loading] = useAuthState(auth);
    if (loading) {
        return <Loader />
    }
    return (
        <div>
            <Banner />
            <Rooms />
            <Reviews />
            <OurOffer />
            <GetReady />
            <HomepageBlogs />
        </div>
    );
};

export default Home;



