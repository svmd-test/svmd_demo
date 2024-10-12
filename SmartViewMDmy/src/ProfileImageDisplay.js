import React, { useRef, useState, useEffect } from 'react';
import { getDownloadUrl } from './firebase/user';

export const ProfileImageDisplay = ({ id }) => {
  const fileInput = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    getDownloadUrl(id).then((url) => !!url && setImageUrl(url));
  }, [id]);

  if (imageUrl) {
    return (
      <div className="four wide column profile-image">
        <img
          className="ui image"
          src={imageUrl || ''}
          alt="profile"
        />
      </div>  
    );
  }
  else {
    return ('')
  }

};
