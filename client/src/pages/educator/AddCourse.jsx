import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import uniqid from 'uniqid'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const quilRef = useRef(null)
  const editorRef = useRef(null)

  const [coursesTitle, setCoursesTitle] = useState('')
  const [coursesPrice, setCoursesPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle:'',
      lectureDuration:'',
      lectureUrl:'',
      isPreviewFree: false,
    }
  )

  const handleChapter =(action, chapterId)=>{
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter={
          chapterId: uniqid(),
          chapterTitle:title,
          chapterContent:[],
          collapsed:false,
          chapterOrder:chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
        };
        setChapters([...chapters, newChapter]);
      }
    }
    else if (action === 'remove') {
      setChapters(chapters.filter((chapter)=>chapter.chapterId !== chapterId));
    }
    else if (action==='toggle') {
      setChapters(
        chapters.map((chapter)=>
        chapter.chapterId === chapterId ? {
          ...chapter, collapsed: !chapter.collapsed
        } : chapter
      )
    );
    }
  };


  const handleLecture =(action, chapterId, lectureIndex) =>{
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }
    else if (action === 'remove') {
      setChapters(
        chapters.map((chapter)=>{
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      )
    }
  }

  useEffect(()=>{
    if(!quilRef.current && editorRef.current){
      quilRef.current = new Quill(editorRef.current,{
        theme:'snow'
      });
    }
  }, [])

  return (
    <div className='h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pd-0 p-4 pt-8 pb-0'>
     <form className='h-screen flex flex-col gap-4 max-w-md w-full text-gray-500'>
      <div className='flex flex-col gap-1'>
        <p>Course Title</p>
        <input onChange={e => setCoursesTitle(e.target.value)} value={coursesTitle} 
        type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 rounded border border-gray-500' required />
      </div>
      <div className='flex flex-col gap-1'>
        <p>Course Description</p>
       <div ref={editorRef}></div>
      </div>
       {/*adding chapter & lectures */} 

        <div className='flex items-center justify-between flex-wrap'>
            <div className='flex flex-col gap-1'>
                 <p>Course Price</p>
                 <input onChange={e=> setCoursesPrice(e.target.value)} 
                 value={coursesPrice} type="number" placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 
                  rounded border border-gray-500 ' required />
            </div>

            <div className='flex md:flex-row flex-col items-center gap-3'>
              <p>Course Thumbnail</p>
              <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
                <img src={assets.file_upload_icon} alt="file_upload_icon" className='p-3 bg-blue-500 rounded' />
                <input type="file" id='thumbnailImage' onChange={e=> setImage(e.target.files[0]) }
                 accept="image/*" hidden />
                 <img src={image ? URL.createObjectURL(image):''} alt="" className='max-h-10' />
              </label>
            </div>
        </div>   

        
            <div className='flex flex-col gap-1'>
                 <p>Discount %</p>
                 <input onChange={e=> setDiscount(e.target.value) } value={discount}
                type="number" placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 
                  rounded border border-gray-500 ' required />
            </div> 

            <div>
              {chapters.map((chapter,chapterIndex)=>(
                <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
                  <div className='flex justify-between items-center p-3'>
                    <div className='flex items-center gap-2 flex-1'>
                      <img src={assets.down_arrow_icon} alt="" width={12} 
                      onClick={()=>handleChapter('toggle',chapter.chapterId)}
                      className={`cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}/>
                      <span className='font-medium text-sm'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <span className='text-gray-500 text-sm'>{chapter.chapterContent.length} Lectures</span>
                      <img src={assets.cross_icon} alt="" width={16} className='cursor-pointer' 
                      onClick={()=>handleChapter('remove',chapter.chapterId)} />
                    </div>
                  </div>
                  {!chapter.collapsed && (
                    <div className='px-3 pb-3 pt-0'>
                      {chapter.chapterContent.map((lecture, lectureIndex)=>(
                        <div key={lectureIndex} className='flex justify-between items-center mb-2 text-sm'>
                          <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl}
                          target="_blank" className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'paid'}</span>
                          <img src={assets.cross_icon} alt="" width={14} className='cursor-pointer'
                          onClick={()=>handleLecture('remove',chapter.chapterId, lectureIndex)} />
                        </div>
                      ))}
                      <button type='button' className='text-sm text-gray-600 mt-2' onClick={()=>handleLecture('add',chapter.chapterId)}>+ Add Lecture</button>
                    </div>
                  )}
                </div>
              ))}
              <button type='button' className='w-full text-center bg-blue-50 text-blue-600 p-3 rounded-lg 
              cursor-pointer text-sm' onClick={()=>handleChapter('add')}>+ Add Chapter</button>
              {showPopup && (
                <div className='fixed inset-0 items-center justify-center flex
                 bg-gray-800 bg-opacity-50 '>
                  <div className='bg-white text-gray-700 p-4 rounded relative
                  w-full max-w-80'>
                    <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
                      <div className='mb-2'>
                         <p>Lecture Title</p>
                         <input 
                          type="text"
                           className=' py-1 px-2 block w-full  border rounded '
                           value={lectureDetails.lectureTitle}
                          onChange={e => setLectureDetails({...lectureDetails,lectureTitle:e.target.value})} 
                          
                          />
                       </div>

                       <div className='mb-2'>
                         <p>Duration (minutes)</p>
                         <input 
                          type="number" 
                           className=' py-1 px-2 block w-full  border rounded '  
                            value={lectureDetails.lectureDuration}
                          onChange={e => setLectureDetails({...lectureDetails,lectureDuration:e.target.value})}
                         
                         />
                       </div>
                       
                        <div className='mb-2'>
                         <p>Lecture URL</p>
                         <input 
                          type="text" 
                         
                         
                          className=' py-1 px-2 block w-full  border rounded '
                           value={lectureDetails.lectureUrl}  
                           onChange={e => setLectureDetails({...lectureDetails,lectureUrl:e.target.value})}/>
                       </div>

                        <div className='flex gap-2 my-4'>
                         <p> Is Preview Free?</p>
                         <input 
                          type="checkbox" 
                           className='mt-1 scale-125'
                          checked={lectureDetails.isPreviewFree}
                        
                           onChange={e => setLectureDetails({...lectureDetails,isPreviewFree:e.target.checked})}  />
                       </div>

                       <button type='button' className='w-full bg-blue-400 text-white px-4
                       py-2 rounded' onClick={()=>{
                         setChapters(chapters.map((chapter)=>{
                           if(chapter.chapterId === currentChapterId){
                             return {...chapter, chapterContent:[...chapter.chapterContent, lectureDetails]};
                           }
                           return chapter;
                         }));
                         setLectureDetails({lectureTitle:'',lectureDuration:'',lectureUrl:'',isPreviewFree:false});
                         setShowPopup(false);
                       }}>Add</button>

                       <img onClick={()=> setShowPopup(false)} src={assets.cross_icon} alt="" 
                       className='absolute top-4 right-4 w-4 cursor-pointer'/>
                  </div>
                 </div>
              )}
            </div>
       
      
              <button type='submit' className=' bg-black text-white w-max py-2.5 px-8
                rounded my-4'>Add</button>
     </form>
    </div>
  )
}

export default AddCourse
