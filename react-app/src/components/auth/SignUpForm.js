import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

const SignUpForm = () => {
  const hiddenFileInput = useRef(null);
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isPhoto, setIsPhoto] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [firstSubmit, setFirstSubmit] = useState(false)
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  useEffect(() => {
    const errors = [];
    if (!username) errors.push('A username is required.');
    if (!email) errors.push('An email is required.');
    if (!validateEmail(email)) errors.push('Must be a valid email address.');
    if (!password) errors.push('A password is required.');
    if (password.length < 6) errors.push('Password length must be at least 6 characters.');
    if (!repeatEmail) errors.push('Please repeat the email.');
    if (email !== repeatEmail) errors.push('Email and repeated email must match.');
    if (username.length > 40) errors.push('Username must be 40 characters or less.');
    if (email.length > 255) errors.push('Email length must be 255 characters or less.');
    if (password.length > 255) errors.push('Password length must be 255 characters or less.');
    if (!isPhoto) errors.push('The file must be a png, jpg, or jpeg.');
    
    setErrors(errors);
  }, [username, email, password, repeatEmail, photo, isPhoto]);

  const handleClick = e => {
    e.preventDefault();
    setIsPhoto(true);
    hiddenFileInput.current.click();
  };

  const onSignUp = async (e) => {
    e.preventDefault();
    setFirstSubmit(true);

    if (!errors.length && photo) {

      const formData = new FormData();
      formData.append("photo", photo);

      setPhotoLoading(true);
      const res = await fetch('/api/auth/photo', {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const jsonRes = await res.json();
        setPhotoLoading(false);

        const user = {
          username,
          email,
          password,
          photoUrl: jsonRes.source
        };

        const errors = await dispatch(signUp(user));
      
        if (errors) {
          setErrors(errors)
        }

      } else {
        setPhotoLoading(false);
        setIsPhoto(false);

      }

    } else if (!errors.length) {

      const user = {
        username,
        email,
        password,
        photoUrl: 'https://ear-fruit-bucket.s3.us-west-1.amazonaws.com/no-pic.png'
      };

      const errors = await dispatch(signUp(user));
      
      if (errors) {
        setErrors(errors)
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatEmail = (e) => {
    setRepeatEmail(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='song_form_div'>
      <form onSubmit={onSignUp} className='song_form'>
        { (errors.length > 0 && firstSubmit) && <div className='song_form_errors'>
          {errors.map((error, ind) => (
            <div key={ind} className='song_form_error'>{error}</div>
          ))}
        </div> }
        <div className='song_form_divs'>
          <div className='sf_label'><label>What's your email?</label></div>
          <input
            type='text'
            name='email'
            placeholder='Enter your email.'
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div className='song_form_divs'>
          <div className='sf_label'><label>Confirm your email</label></div>
          <input
            type='text'
            name='email'
            placeholder='Enter your email again.'
            onChange={updateRepeatEmail}
            value={repeatEmail}
            required={true}
          ></input>
        </div>
        <div className='song_form_divs'>
          <div className='sf_label'><label>Create a Password</label></div>
          <input
            type='password'
            name='password'
            placeholder='Create a password.'
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div className='song_form_divs'>
          <div className='sf_label'><label>What should we call you?</label></div>
          <input
            type='text'
            name='username'
            placeholder='Enter a profile name.'
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div className='song_form_divs'>
          <div className='sf_label'><label htmlFor='source'>(Optional) Upload your profile picture</label></div>
            <button onClick={(e)=> handleClick(e)}>
              Upload png/jpg/jpeg
            </button>
            <input
              name='source'
              type='file'
              accept=''
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              onChange={(e) => setPhoto(e.target.files[0])}
            />
        </div>
        {photo && <p className='song_form_p'>{photo.name}</p>}
        {(photoLoading) && <p className='song_form_divs'>Uploading   <img src='https://i.gifer.com/ZZ5H.gif' alt='Uploading' className='uploading_img'></img></p>}
        <button type='submit' className='song_form_divs sf_submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
