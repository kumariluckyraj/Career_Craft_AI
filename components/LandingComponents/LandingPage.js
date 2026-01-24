import Hero from './Hero';
import About from './About';
import { Workflow } from 'lucide-react';
import OurServices from './WorkFlow';
import Testimonial from './Testimonial';
import GetStart from './GetStart';
import Resume from './Resume';
export default function Home() {
    return (
        <>

            
            <div> 
                  
                  
                <Hero />
                  <GetStart/>
                <About />
              <OurServices />
              <Resume/>
                <Testimonial/>
              
                
           </div>
           
{/*<div className="flex flex-col items-center  text-center">
                <Diwali />

                 

                <Companiesd />
                <CoursesSection />
                <PdfCourse />
                <TestimonialsSection />
                <CallToAction />
            

   */}
           
           
            {/*<CouponPopup
                imageSrc="/images/puja sp.png"
                title="Puja Special Offer!"
                description="Apply coupon code 'FESTIVE10' to avail flat 10% off on all courses!"
            />*/}
        </>
    );
}
