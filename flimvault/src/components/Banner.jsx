import React from 'react'

function Banner({poster_path,name}) {
  return (
    <div className='flex  h-[50vh] md:h-[70vh]  items-end bg-cover bg-center ' style={{
  backgroundImage: `url(https://image.tmdb.org/t/p/original/${poster_path})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}}>

  <div className='text-white text-2xl w-full text-center bg-gray-900/90 p-4'>{name}</div>
  
</div>
  )
}

export default Banner