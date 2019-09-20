import React, { Component } from 'react';

class PictureUpdateUser extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <form action="/api/post/uploadphoto" enctype="multipart/form-data" method="POST"> 
        <input type="file" name="picture" accept="image/*" />
        <input type="submit" value="Upload an Image"/>
      </form>
    );
  }
}

export default PictureUpdateUser
