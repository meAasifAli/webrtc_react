import { useParams } from 'react-router-dom'
import CallComponent from '../CallComponent'

const Calling = () => {
    const { id } = useParams()

    return (
        <CallComponent roomId={id} />
    )
}
export default Calling