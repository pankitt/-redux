import React, { Component } from 'react';
import CarouselMain from '../components/carousel/CarouselMain';
import CarouselsList from './CarouselsList';
import TopBanners from '../components/banners/TopBanners';
import { clearMeta, addMeta } from '../helpers/metaTags';
import t from '../i18n';

export default class Home extends Component {
    componentDidMount() {
        document.title = 'OLL.TV ' + t('meta_home_og_title');
        addMeta(
            { description: t('meta_home_description') },
            {
                title: t('meta_home_og_title'),
                description: t('meta_home_og_description'),
                url: window.location.href,
                image: 'https://s5.ollcdn.net/i/30/b7/05/30b705_cms.jpg',
                type: 'website',
                'site_name': 'OLL.TV',
            });
    }

    componentWillUnmount() {
        clearMeta();
    }

    render() {
        return (
            <div className="page-home">
                <CarouselMain />
                <TopBanners />
                <CarouselsList page="main"/>
            </div>
        );
    }
}
