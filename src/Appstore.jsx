import React from 'react';

const Appstore = () => {
    const apps = [
        {
            name: 'Robot Policies',
            dateCreated: '2023-01-01',
            downloads: 1200,
        },
        {
            name: 'Robot Datasets',
            dateCreated: '2023-02-15',
            downloads: 800,
        },
    ];

    return (
        <div>
            <h1>App Store</h1>
            <ul>
                {apps.map((app, index) => (
                    <li key={index}>
                        <h2>{app.name}</h2>
                        <p>Date Created: {app.dateCreated}</p>
                        <p>Downloads: {app.downloads}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appstore;