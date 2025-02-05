import './authorLookup.less';

import React from 'react';
import request from 'superagent';

const authorLookup = ()=>{
	const [author, setAuthor] = React.useState('');
	const [searching, setSearching] = React.useState(false);
	const [results, setResults] = React.useState([]);

	const lookup = async ()=>{
		if(!author) return;

		setSearching(true);
		setResults([]);

		await request.get(`/admin/user/list/${author}`)
            .then((brews)=>{
            	setResults(brews.body);
            	setSearching(false);
            });
	};

	const renderResults = ()=>{
		if(results.length == 0) return <>
			<h2>Results</h2>
			<p>None found.</p>
		</>;

		return <>
			<h2>{`Results - ${results.length}`}</h2>
			<table className='resultsTable'>
				<thead>
					<tr>
						<th>Title</th>
						<th>Share</th>
						<th>Edit</th>
						<th>Last Update</th>
						<th>Storage</th>
					</tr>
				</thead>
				<tbody>
					{results
                        .sort((a, b)=>{         // Sort brews from most recently updated
                        	if(a.updatedAt > b.updatedAt) return -1;
                        	if(a.updatedAt < b.updatedAt) return 1;
                        	return 0;
                        })
                        .map((brew, idx)=>{
                        	return <tr key={idx}>
                        		<td>{brew.title}</td>
                        		<td>{brew.shareId}</td>
                        		<td>{brew.editId}</td>
                        		<td>{brew.updatedAt}</td>
                        		<td>{brew.googleId ? 'Google' : 'Homebrewery'}</td>
                        	</tr>;
                        })}
				</tbody>
			</table>
		</>;
	};

	const handleKeyPress = (evt)=>{
		if(evt.key === 'Enter') return lookup();
	};

	const handleChange = (evt)=>{
		setAuthor(evt.target.value);
	};

	return (
		<div className='authorLookup'>
			<div className='authorLookupInputs'>
				<h2>Author Lookup</h2>
				<label className='field'>
                    Author Name:
					<input className='fieldInput' value={author} onKeyDown={handleKeyPress} onChange={handleChange} />
					<button onClick={lookup}>
						<i className={`fas ${searching ? 'fa-spin fa-spinner' : 'fa-search'}`} />
					</button>
				</label>
			</div>
			<div className='authorLookupResults'>
				{renderResults()}
			</div>
		</div>
	);
};

module.exports = authorLookup;
