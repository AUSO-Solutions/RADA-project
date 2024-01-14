
import { Input,Button } from 'Components'

import React from 'react'

const UserLogin = () => {
    return (
        <div>
            <Input label={'Username'} />
            <Button  width={'100px'} shadow>
                Login
            </Button>
        </div>
    )
}

export default UserLogin