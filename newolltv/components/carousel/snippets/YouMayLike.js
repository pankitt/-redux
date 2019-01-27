import { React } from 'react';
import t from '../../../i18n';

const YouMayLike = () => (
    <div className="carousel-item col you-may-like" key="recommendToViewSnippet">
        <div className="with-poster snippet">
            <div className="poster">
                <div className="bg">
                    <span>{t('You may like 1')} <br/> {t('You may like 2')}</span>
                </div>
            </div>
        </div>
    </div>
);

export default YouMayLike;