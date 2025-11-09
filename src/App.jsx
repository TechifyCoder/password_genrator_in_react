import { useCallback, useEffect, useRef, useState } from 'react'
import zxcvbn from 'zxcvbn'
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";


function App() {

  const passordRef = useRef(null)

  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0)
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [isGenrated, setIsGenrated] = useState(false)
  const [savedPasswords, setSavedPasswords] = useState([]);

  const generatePassword = useCallback(() => {
    let pass = ""
    let spcialChar = "~!@#$%^&*()_+}{|:<>?"
    if (numberAllowed) spcialChar += "0123456789"
    if (charAllowed) spcialChar += "QWERTYUIOPASDFGHJKLMNBVCXZmnbvcxzasdfghjklpoiuytrewq"

    for (let i = 0; i <= length; i++) {
      let char = Math.floor(Math.random() * spcialChar.length + 1)
      pass += spcialChar.charAt(char)
    }
    setPassword(pass)
  }, [length, numberAllowed, charAllowed, setPassword])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPasswords")) || [];
  }, []);


  const handleSave = () => {
    // pehle se saved passwords la
    const existing = JSON.parse(localStorage.getItem("savedPasswords")) || [];

    // agar current password already present nahi hai to hi add kar
    if (password && !existing.includes(password)) {
      existing.push(password);
      localStorage.setItem("savedPasswords", JSON.stringify(existing));
      setSavedPasswords(existing)
      alert("Password saved successfully!");
    } else {
      alert("Password already exists or empty!");
    }
  };

  const handleDelete = (passwordToDelete) => {
    const updated = savedPasswords.filter(p => p !== passwordToDelete);
    localStorage.setItem("savedPasswords", JSON.stringify(updated));
    setSavedPasswords(updated); // update UI immediately
  }

  const handlCopy = useCallback(() => {
    window.navigator.clipboard.writeText(password).
      then(() => alert("password saved successfully")).
      catch(() => alert("failed to copy"))
  }, [password])

  const handleSaveCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).
      then(() => alert("password saved successfully")).
      catch(() => alert("failed to copy"))
  }

  useEffect(() => {
    if (isGenrated) {
      generatePassword();
    }
  }, [generatePassword, isGenrated, numberAllowed, charAllowed, length])
  const genratedpass = () => {
    setIsGenrated(true)
    generatePassword()
  }

  const createPass = () => {
    setIsGenrated(false)
  }


  useEffect(() => {
    const strenth = zxcvbn(password)
    setScore(strenth.score)
  }, [password])

  let strenthText;
  let strengthColor;
  if (score === 1) {
    strenthText = "very weak"
    strengthColor = "text-red-500"
  } else if (score === 2) {
    strenthText = "weak"
    strengthColor = "text-yellow-500"
  } else if (score === 3) {
    strenthText = "fair"
    strengthColor = "text-gray-500"
  } else if (score === 4) {
    strenthText = "strong"
    strengthColor = "text-green-500"
  } else if (score === 5) {
    strenthText = "very strong"
    strengthColor = "text-blue-500"
  } else {
    strenthText = "Please enter your password"
    strengthColor = "text-cyan-500"
  }

  return (
    <div className=' mx-auto w-7xl h-auto my-24 rounded-2xl bg-gray-800 text-white'>
      <div className='grid grid-cols-2 gap-2'>
        <div>
          <div className='w-3xl pl-9 m-5'>
            <button
              className='bg-green-800 rounded-b-2xl p-1 px-2 cursor-pointer'
              onClick={handleSave}
            >save</button>
            <input
              type="text"
              readOnly={isGenrated}
              ref={passordRef}
              max={10}
              placeholder='Password'
              className='bg-blue-400 min-w-xl rounded-b-4xl p-1 pl-5 outline-none '
              value={password}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 50) {
                  setPassword(value)
                } else {
                  setPassword(value.slice(0, 50))
                }

              }}
            />
            <button
              onClick={handlCopy}
              className='bg-amber-500 rounded-b-2xl p-1 px-2 cursor-pointer'>copy</button>
            <div>
              <span className='inline-block  my-3 font-bold text-2xl' id='scorePass'>Password strenth :  </span>
              <span className={`my-3 font-bold text-2xl  ${strengthColor}`}> {strenthText} </span>
            </div>
          </div>
          <button
            className='inline-block my-3 mx-14 px-5 font-bold text-2xl bg-blue-600 rounded-lg cursor-pointer p-1'
            onClick={genratedpass}
          >Genrate Password
          </button>
          {isGenrated && <button
            className='inline-block ml-5 px-4   font-bold text-2xl bg-amber-600 rounded-lg cursor-pointer p-1'
            onClick={createPass}
          >Create Password</button>}
          <div>
            <div>
              <h3 className='inline-block  my-3 mx-9 pl-5 font-bold text-lg  rounded-lg cursor-pointer p-1'>Set your Password length : {length}</h3>

              <input
                type="range"
                min={8}
                max={20}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />

            </div>
            <div>
              <h3 className='inline-block  my-3 mx-10 px-5 font-bold text-lg  rounded-lg cursor-pointer p-1'>You are include number</h3>
              <input
                type="checkbox"
                className='peer relative appearance-none w-5 h-5 ml-2.5 border rounded-full border-blue-400 cursor-pointer checked:bg-blue-600 checked:border-blue-600 '
                checked={numberAllowed}
                onChange={(e) => setNumberAllowed(e.target.checked)}
              />

            </div>
            <div>
              <h3 className='inline-block  my-3 mx-10 px-5 font-bold text-lg  rounded-lg cursor-pointer p-1'>You are include Alphabet</h3>
              <input
                type="checkbox"
                className='peer relative appearance-none w-5 h-5 border rounded-full border-blue-400 cursor-pointer checked:bg-blue-600 checked:border-blue-600'
                checked={charAllowed}
                onChange={(e) => setCharAllowed(e.target.checked)}
              />

            </div>
          </div>
        </div>
        <div className='flex justify-center items-start  border border-none  backdrop-blur-md w-96 ml-60 rounded-l-4xl '>


          <ul>
            {(JSON.parse(localStorage.getItem("savedPasswords")) || []).map((p, i) => (
              <li
                key={i} className="mb-5 border border-white w-3xs mt-8 rounded-4xl py-2 pl-4 pr-2 bg-amber-600 font-bold flex items-center justify-between"
                ref={passordRef}
              >

                <button
                  className='ml-3 text-white bg-black p-2 rounded-full hover:bg-red-700 transition'
                  onClick={() => handleDelete(p)}
                ><MdDelete /></button>
                <span className='text-center flex-1'>{p}</span>
                <button
                  className='ml-3 text-white bg-black p-2 rounded-full hover:bg-blue-900 transition'
                  onClick={() => handleSaveCopy(p)}
                ><IoCopy /></button>

              </li>
            ))}
          </ul>


        </div>
      </div>

    </div>
  )
}

export default App
